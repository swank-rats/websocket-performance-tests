__author__ = 'Johannes'

from SwankRatsPerformanceTestWebSocketClient import SwankRatsPerformanceTestWebSocketClient

if __name__ == '__main__':
    try:
        ws = SwankRatsPerformanceTestWebSocketClient('ws://172.16.50.157:3000', protocols=['http-only', 'chat'])
        ws.connect()
        ws.run_forever()
    except KeyboardInterrupt:
        ws.close()