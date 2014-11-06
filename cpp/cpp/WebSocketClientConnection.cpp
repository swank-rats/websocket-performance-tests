#include <Poco\Net\HTTPSClientSession.h>
#include <Poco\Net\WebSocket.h>
#include <Poco\Net\HTTPRequest.h>
#include <Poco\Net\HTTPMessage.h>
#include <Poco\Net\HTTPResponse.h>

#include "WebSocketClientConnection.h"

using Poco::URI;
using Poco::Net::HTTPSClientSession;
using Poco::Net::WebSocket;
using Poco::Net::HTTPMessage;
using Poco::Net::HTTPRequest;
using Poco::Net::HTTPResponse;
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
		HTTPSClientSession session(uri.getHost(), uri.getPort(), pContext);
		HTTPRequest req(HTTPRequest::HTTP_GET, uri.getPath(), HTTPMessage::HTTP_1_1);
		HTTPResponse res;

		webSocket = new WebSocket(session, req, res);
				
		char buffer[1024];
		int flags;
		int n;
		std::string payload = "";
		
		//setup connection
		webSocket->sendFrame(payload.data(), payload.size(), WebSocket::FRAME_TEXT);
		
		while (!isCancelled()) {
			n = webSocket->receiveFrame(buffer, sizeof(buffer), flags);

			webSocket->sendFrame(buffer, n, WebSocket::FRAME_TEXT);
		}
	}
	catch (Exception& e) {
		std::cerr << "Exception: " << e.what() << std::endl;
		std::cerr << "Message: " << e.message() << std::endl;
		std::cerr << e.displayText() << std::endl;
	}


	if (webSocket != nullptr) {
		webSocket->close();
		std::cerr << "Connection closed" << std::endl;
	}
}