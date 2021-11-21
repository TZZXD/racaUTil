import logging
import smtplib
from typing import Tuple, Dict, Any, NoReturn

from email.utils import formataddr
from email.mime.text import MIMEText

from utils.base import exception_decorators
from radiocaca.config import SMTP_TO_USERS, SMTP_TYPE_MAPPING


class EmailHandler:
    def __init__(self, user: str, pwd: str, svr_type: str, to_users: [Tuple[str]] = SMTP_TO_USERS):
        self.user = user
        self.pwd = pwd
        self.svr_type = svr_type
        self.to_users = to_users
        self.logger = logging.getLogger(__name__)

    @exception_decorators
    def send(self, email_msg: str) -> NoReturn:
        """
        发送邮件
        """
        # SMTP服务器，腾讯企业邮箱端口是465，腾讯邮箱支持SSL(不强制)， 不支持TLS
        with smtplib.SMTP_SSL(**SMTP_TYPE_MAPPING[self.svr_type]) as server:
            # 登录服务器，括号中对应的是发件人邮箱账号、邮箱密码
            server.login(self.user, self.pwd)
            # 构建发送的消息
            msg = self._build_msg(email_msg).as_string()
            # 发送邮件，括号中对应的是发件人邮箱账号、收件人邮箱账号、发送邮件
            server.sendmail(self.user, to_addrs=self.to_users, msg=msg)
            self.logger.info("send email successful to user: %s, msg: %s", self.to_users, msg)

    def _build_msg(self, email_msg: str) -> MIMEText:
        """构建邮件信息"""
        # 邮件内容
        msg = MIMEText(email_msg, 'plain', 'utf-8')
        # 括号里的对应发件人邮箱昵称、发件人邮箱账号
        msg['From'] = formataddr(("raca", self.user))
        # 括号里的对应收件人邮箱昵称、收件人邮箱账号
        msg['To'] = formataddr(("聚义堂", self.to_users[0]))
        # 邮件的主题
        msg['Subject'] = "raca官方市场价格通知"
        return msg


# if __name__ == "__main__":
#     from radiocaca.config import SMTP_EMAIL_CONFIG, SMTP_SSL_CONFIG
#     my = EmailHandler(**SMTP_EMAIL_CONFIG, ssl_config=SMTP_SSL_CONFIG)
#     my.send("当前官方价格低于xx元")
