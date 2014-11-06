#include <string>

#include <Poco\URI.h>
#include <Poco\Exception.h>
#include <Poco\Net\HTTPMessage.h>
#include <Poco\Net\HTTPRequest.h>
#include <Poco\Net\HTTPResponse.h>
#include <Poco\Net\AcceptCertificateHandler.h>
#include <Poco\Net\InvalidCertificateHandler.h>
#include <Poco\Net\Context.h>
#include <Poco\URI.h>
#include <Poco\Net\HTTPServer.h>
#include <Poco\Net\HTTPSClientSession.h>
#include <Poco\Net\WebSocket.h>
#include <Poco\Net\SSLManager.h>
#include <Poco\TaskManager.h>
#include <Poco\Util\Application.h>
#include <Poco\Util\Option.h>
#include <Poco\Util\OptionSet.h>
#include <Poco\Util\OptionCallback.h>
#include <Poco\Util\HelpFormatter.h>

#include "WebSocketClientConnection.h"

using Poco::URI;
using Poco::Net::HTTPSClientSession;
using Poco::Net::InvalidCertificateHandler;
using Poco::Net::AcceptCertificateHandler;
using Poco::Net::Context;
using Poco::Net::SSLManager;
using Poco::Net::WebSocket;
using Poco::TaskManager;
using Poco::Net::HTTPRequest;
using Poco::Net::HTTPResponse;
using Poco::Util::Application;
using Poco::Util::Option;
using Poco::Util::OptionSet;
using Poco::Util::OptionCallback;
using Poco::Util::HelpFormatter;

class WebSocketClient : public Poco::Util::Application {
public:
	WebSocketClient() : helpRequested(false)
	{
	}

	void OpenConnection()  {
		connection = new WebSocketClientConnection(uri, pContext);
		URI uri = connection->GetURI();
		taskManager.start(connection);
	}

	void CloseConnection()  {
		try {
			if (connection != nullptr) {
				URI uri = connection->GetURI();
				taskManager.joinAll();
			}
		}
		catch (Poco::SyntaxException& e) {
			std::cerr << e.displayText() << std::endl;
		}
	}
protected:
	void initialize(Application& self) {
		loadConfiguration();
		Application::initialize(self);

		Poco::SharedPtr<InvalidCertificateHandler> pAcceptCertHandler =	new AcceptCertificateHandler(true);
		pContext = new Context(Context::CLIENT_USE, "", "", "", Context::VERIFY_NONE, 9, false, "ALL:!ADH:!LOW:!EXP:!MD5:@STRENGTH");
		SSLManager::instance().initializeClient(NULL, pAcceptCertHandler, pContext);
	}

	void reinitialize(Application& self) {
		Application::reinitialize(self);
	}

	void uninitialize() {
		Application::uninitialize();
	}

	void defineOptions(OptionSet& options) {
		Application::defineOptions(options);
		options.addOption(
			Option("help", "h", "display help information")
			.required(false)
			.repeatable(false)
			.callback(OptionCallback<WebSocketClient>(this, &WebSocketClient::HandleHelp)));

		options.addOption(
			Option("uri", "u", "Address to server e.g. ws://127.0.0.1:3001/")
			.required(true)
			.repeatable(false)
			.argument("addr")
			.callback(OptionCallback<WebSocketClient>(this, &WebSocketClient::HandleURI)));
	}

	int main(const std::vector<std::string>& args)
	{
		if (!helpRequested)
		{
			OpenConnection();
			
			while (1) { }
		}

		return EXIT_OK;
	}
private:
	WebSocketClientConnection* connection;
	TaskManager taskManager;
	URI uri;
	bool helpRequested;
	Context::Ptr pContext;

	void displayHelp()
	{
		HelpFormatter helpFormatter(options());
		helpFormatter.setCommand(commandName());
		helpFormatter.setUsage("OPTIONS");
		helpFormatter.setHeader(
			"Websocket Performance testing client");
		helpFormatter.format(std::cout);
	}
	void HandleHelp(const std::string& name, const std::string& value)
	{
		helpRequested = true;
		displayHelp();
		stopOptionsProcessing();
	}

	void HandleURI(const std::string& name, const std::string& value)
	{
		uri = URI(value);
	}
};

POCO_APP_MAIN(WebSocketClient);