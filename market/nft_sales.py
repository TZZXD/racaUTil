"""
市场商品相关代码
"""

import requests

from utils.base import exception_decorators, base_url, CommonException

nft_sales_url = '/nft-sales'


# @exception_decorators
def get_nft_sales_list(**kwargs):
    """根据指定条件获取NFT列表
    """
    params = {
        'pageNo': kwargs.get('pageNo', 1),  # 页码，默认1
        'pageSize': kwargs.get('pageSize', 20),  # 页大小，默认20
        'sortBy': kwargs.get('sortBy', 'created_at'),  # 排序，默认上架时间
        'order': kwargs.get('order', 'desc'),  # 排序，默认倒叙
        'name': kwargs.get('name', ''),  # 名称搜索
        'saleType': kwargs.get('saleType', ''),  # TODO 未知
        'category': kwargs.get('category', 13),  # NFT品类，从categories.get_all_categories()中获取ID，
        'tokenType': kwargs.get('tokenType', ""),  # TODO 未知
    }
    url = base_url + nft_sales_url + '?' + '&'.join([f'{key}={value}' for key, value in params.items()])
    response = requests.get(url)
    if not response.ok:
        raise CommonException(
            function='get_nft_sales_list',
            request_data=url,
            response_data=response.text,
            msg="http error"
        )
    res = response.json()
    if res['code'] != 200:
        raise CommonException(
            function='get_nft_sales_list',
            request_data=url,
            response_data=response.text,
            msg="result error"
        )
    return res['list']


def get_target_nft_sales_list(min_price, max_price, **kwargs):
    """获取目标价格区间的NFT列表
    """
    return [
        row for row in get_nft_sales_list(**kwargs)
        if min_price <= float(row['fixed_price']) / row['count'] <= max_price
    ]


def get_target_nft_info(nft_id):
    url = base_url + nft_sales_url + '/' + str(nft_id)
    response = requests.get(url)
    if not response.ok:
        raise CommonException(
            function='get_target_nft_info',
            request_data=url,
            response_data=response.text,
            msg="http error"
        )
    res = response.json()
    if res['code'] != 200:
        raise CommonException(
            function='get_target_nft_info',
            request_data=url,
            response_data=response.text,
            msg="result error"
        )
    return res['data']


def judge_status(data):
    if data['status'] == 'active':
        return True, data['id_in_contract']
    return False, None
