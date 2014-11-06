#pragma once
#include <Poco\URI.h>
#include <Poco\Net\HTTPServer.h>
#include <Poco\Net\HTTPSClientSession.h>
#include <Poco\Net\WebSocket.h>
#include <Poco\Task.h>
#include <Poco\TaskManager.h>
#include <Poco\Net\Context.h>

using Poco::URI;
using Poco::Task;
using Poco::Net::Context;

class WebSocketClientConnection : public Task
{
public:
	WebSocketClientConnection(URI uri, Context::Ptr pContext);
	void runTask();
	URI GetURI();
private:
	URI uri;
	Context::Ptr pContext;
};