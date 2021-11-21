from multiprocessing import Process

from radiocaca.run import main

if __name__ == '__main__':
    data = {
        # 药水
        "Potion": {
            "nft_name": "Potion", "category_id": 15, "min_price": 0, "max_price": 3000, "size": 20
        },
        # 元兽
        "Metamon": {
            "nft_name": "Metamon", "category_id": 13, "min_price": 0, "max_price": 200000, "size": 20
        },
        # 蛋
        "Egg": {
            "nft_name": "Egg", "category_id": 17, "min_price": 0, "max_price": 10000, "size": 20
        },
        # 黄钻
        "Yellow Diamond": {
            "nft_name": "Yellow Diamond", "category_id": 16, "min_price": 0, "max_price": 30000, "size": 20,
            'name': 'Yellow Diamond'
        },
        # 紫钻
        "Purple Diamond": {
            "nft_name": "Purple Diamond", "category_id": 16, "min_price": 0, "max_price": 100000, "size": 20,
            'name': 'Purple Diamond'
        },
        # 母盒
        "MPB": {
            "nft_name": "MPB", "category_id": 10, "min_price": 0, "max_price": 400000, "size": 20,
        },
    }
    for key, value in data.items():
        p = Process(target=main, args=(), kwargs=value)
        p.start()
