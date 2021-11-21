base_url = 'https://market-api.radiocaca.com'


class CommonException(Exception):

    def __init__(self, function="", request_data="", response_data="", msg=""):
        self.function = function
        self.request_data = request_data
        self.response_data = response_data
        self.msg = msg
        print(f'执行错误：{self.function}, {self.request_data}, {self.response_data}, {self.msg}')


def exception_decorators(function):
    def wrapper(*args, **kw):
        try:
            return function(*args, **kw)
        except (Exception,) as error:
            raise CommonException(function=function.__name__, msg=f"internal error: {error}")

    return wrapper
