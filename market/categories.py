"""
品类相关代码
"""
import requests

from utils.base import base_url, exception_decorators, CommonException

categories_url = '/categories'


# @exception_decorators
def get_all_categories():
    """获取所有品类
    """
    response = requests.get(base_url + categories_url)
    if not response.ok:
        raise CommonException(
            function='get_all_categories',
            request_data=base_url + categories_url,
            response_data=response.text,
            msg="http error"
        )
    res = response.json()
    if res['code'] != 0:
        raise CommonException(
            function='get_all_categories',
            request_data=base_url + categories_url,
            response_data=response.text,
            msg="result error"
        )
    return {row['id']: row for row in res['list']}
