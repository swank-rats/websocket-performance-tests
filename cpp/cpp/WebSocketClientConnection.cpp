#include <Poco\Net\HTTPClientSession.h>
#include <Poco\Net\WebSocket.h>
#include <Poco\Net\HTTPRequest.h>
#include <Poco\Net\HTTPMessage.h>
#include <Poco\Net\HTTPResponse.h>
#include <Poco\Timespan.h>
#include <iostream>
#include <iomanip>
#include "WebSocketClientConnection.h"

using Poco::URI;
using Poco::Net::HTTPClientSession;
using Poco::Net::WebSocket;
using Poco::Net::HTTPMessage;
using Poco::Net::HTTPRequest;
using Poco::Net::HTTPResponse;
using Poco::Timespan;
using Poco::Exception;

WebSocketClientConnection::WebSocketClientConnection(URI uri, Context::Ptr pContext)
: Task("WebSocketClientConnection"), uri(uri), pContext(pContext)
{
}

URI WebSocketClientConnection::GetURI() {
	return uri;
}

void WebSocketClientConnection::runTask() {
	WebSocket* webSocket = nullptr;

	try {
		HTTPClientSession session(uri.getHost(), uri.getPort());
		HTTPRequest req(HTTPRequest::HTTP_GET, uri.getPath(), HTTPMessage::HTTP_1_1);
		HTTPResponse res;

		webSocket = new WebSocket(session, req, res);
				
		char* cBuf = new char[1024];
		int flags;
		int nrOfBytes;
		std::string payload = "";
		Timespan timeout(1000);
		int recPacketCounter = 0;
		int currTurn = 0;
		int packetSize[] = { 1, 1024, 10240, 102400, 1024000 };
		int packetsPerTurn[] = { 10000, 1001, 1001, 1001, 1001 };
		//setup connection
		webSocket->sendFrame(payload.data(), payload.size(), WebSocket::FRAME_TEXT);
		
		std::cout << "Response status: " << std::to_string(res.getStatus()) << " reason: " << res.getReason() << std::endl;

		if (res.getStatus() == res.HTTP_SWITCHING_PROTOCOLS) {
			webSocket->setReceiveTimeout(timeout);
			webSocket->setSendTimeout(timeout);

			std::cout << "Connection established" << std::endl;
			std::cout << "Send echo cmd" << std::endl;

			payload = "{\"cmd\":\"echo\", \"name\":\"cpp\"}";

			nrOfBytes = webSocket->sendFrame(payload.data(), payload.size(), WebSocket::FRAME_TEXT);
			
			std::cout << "Send echo cmd bytes: " << nrOfBytes << std::endl;

			while (!isCancelled()) {
				nrOfBytes = webSocket->receiveFrame(cBuf, packetSize[currTurn], flags);
				++recPacketCounter;

				if (nrOfBytes == 0) {
					std::cout << std::endl << "Connection closed by peer" << std::endl;
					break;
				}

				std::cout << "Packet#: " << std::setw(5) << recPacketCounter << " Received bytes: " << nrOfBytes << "\r";

				webSocket->sendFrame(cBuf, nrOfBytes, WebSocket::FRAME_TEXT);

				if (recPacketCounter >= packetsPerTurn[currTurn]) {
					++currTurn;
					recPacketCounter = 0;
					if (currTurn < sizeof(packetSize) / sizeof(*packetSize)) {
						cBuf = new char[packetSize[currTurn]];
					}
				}
			}
		}
	}
	catch (Exception& e) {
		std::cout << std::endl;
		std::cerr << "Exception: " << e.what() << std::endl;
		std::cerr << "Message: " << e.displayText() << std::endl;
	}

	std::cout << std::endl;

	if (webSocket != nullptr) {
		webSocket->close();
		std::cerr << "Connection closed" << std::endl;
	}
}