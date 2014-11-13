__author__ = 'Johannes'
from ws4py.client.threadedclient import WebSocketClient


class SwankRatsPerformanceTestWebSocketClient(WebSocketClient):

    def __init__(self, url, protocols=None, extensions=None, heartbeat_freq=None, ssl_options=None, headers=None):
        WebSocketClient.__init__(self, url, protocols,extensions,heartbeat_freq,ssl_options,headers)
        self.isOpen = True

    def opened(self):
        print("opened")
        self.send('{"cmd": "echo"}')
    def closed(self, code, reason=None):
        self.isOpen = False
        print "Closed down", code, reason

    def received_message(self, m):
        print m
        if self.isOpen:
            self.send(m)
