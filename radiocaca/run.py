import datetime
import threading
import secrets

from market.nft_sales import get_target_nft_sales_list, get_target_nft_info, judge_status
from notification._email.handler import EmailHandler
from radiocaca.config import SMTP_CONFIGS


def get_id_in_contract(nft_name, category_id, min_price, max_price, size, **kwargs):
    print(
        f"""
----------开始捡漏{nft_name}----------
当前选集规则：按照最新上架排序的前{size}个
当前捡漏（单价）：最低价:[{min_price}]，最高价[{max_price}]
        """
    )
    while True:
        try:
            # 设置价格阈值
            min_price, max_price = min_price, max_price
            # 设置选集大小
            request_data = {'pageNo': 1, 'pageSize': size, 'category': category_id}
            request_data.update(kwargs)
            for row in get_target_nft_sales_list(min_price, max_price, **request_data):
                flag, id_in_contract = judge_status(get_target_nft_info(row['id']))
                if flag:
                    msg = f"""
~~~~~~~~~~~~~~~~~~~~~~~~
捡漏监测到: {nft_name}
当前时间: {datetime.datetime.now()}
上架时间: {datetime.datetime.fromtimestamp(row['start_time'])}
ID: {row["id"]}
token_id: {row["token_id"]}
单价: {float(row["fixed_price"]) / row["count"]}
总量: {row["count"]}
总价: {row["fixed_price"]}
sale_address:  {row["sale_address"]}
id_in_contract: {id_in_contract}
~~~~~~~~~~~~~~~~~~~~~~~~
\n\n
"""
                    print(msg)
                    yield id_in_contract, float(row["fixed_price"]), msg
            # break
        except (Exception,) as error:
            pass


def buy_incontract(id_in_contract, totle_price):
    # 购买NFT
    pass


def send_mail(id_in_contract, totle_price, msg):
    # 发送邮件
    try:
        print(f'开始发送邮件：{id_in_contract}，{totle_price}')
        email_config = secrets.choice(SMTP_CONFIGS)
        email_handler = EmailHandler(**email_config)
        email_handler.send(f"购买函数执行成功（购买结果请检查链上交易）\n{msg}")
        print(f'成功发送邮件：{id_in_contract}，{totle_price}')
    except (Exception,) as error:
        print('邮件发送失败')
        print(error)


def main(nft_name, category_id, min_price, max_price, size, **kwargs):
    for id_in_contract, totle_price, msg in get_id_in_contract(
            nft_name, category_id, min_price, max_price, size, **kwargs
    ):
        buy_incontract(id_in_contract, totle_price)
        try:
            t = threading.Thread(target=send_mail, args=(id_in_contract, totle_price, msg))
            t.start()
        except (Exception,):
            pass
