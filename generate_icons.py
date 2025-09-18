"""
PWA图标生成器
从源图标生成多种尺寸的图标文件，用于PWA应用
"""

import os
from PIL import Image

def generate_icons():
    """
    从icon.png生成各种尺寸的PWA图标
    """
    # 源图标文件路径
    source_icon = "icon.png"

    # 检查源图标是否存在
    if not os.path.exists(source_icon):
        print(f"错误：找不到源图标文件 {source_icon}")
        return False

    # 创建icons目录
    icons_dir = "icons"
    if not os.path.exists(icons_dir):
        os.makedirs(icons_dir)
        print(f"创建目录: {icons_dir}")

    # PWA需要的图标尺寸
    icon_sizes = [
        {"size": 72, "name": "icon-72x72.png"},
        {"size": 96, "name": "icon-96x96.png"},
        {"size": 128, "name": "icon-128x128.png"},
        {"size": 144, "name": "icon-144x144.png"},
        {"size": 152, "name": "icon-152x152.png"},
        {"size": 192, "name": "icon-192x192.png"},
        {"size": 384, "name": "icon-384x384.png"},
        {"size": 512, "name": "icon-512x512.png"}
    ]

    try:
        # 打开源图像
        print(f"正在处理源图标: {source_icon}")
        with Image.open(source_icon) as img:
            # 确保图像是RGBA模式
            if img.mode != 'RGBA':
                img = img.convert('RGBA')

            print(f"源图标尺寸: {img.size}")

            # 生成各种尺寸的图标
            for icon_info in icon_sizes:
                size = icon_info["size"]
                name = icon_info["name"]
                output_path = os.path.join(icons_dir, name)

                # 调整图像尺寸
                resized_img = img.resize((size, size), Image.Resampling.LANCZOS)

                # 保存图标
                resized_img.save(output_path, "PNG", optimize=True)
                print(f"生成图标: {output_path} ({size}x{size})")

            print(f"\n成功生成 {len(icon_sizes)} 个图标文件!")
            return True

    except Exception as e:
        print(f"生成图标时出错: {e}")
        return False

def main():
    """
    主函数
    """
    print("=== PWA图标生成器 ===")
    print("正在从 icon.png 生成多尺寸图标...")

    if generate_icons():
        print("\n✅ 图标生成完成!")
        print("生成的图标已保存到 icons/ 目录")
        print("\n生成的图标文件:")
        icons_dir = "icons"
        if os.path.exists(icons_dir):
            for file in sorted(os.listdir(icons_dir)):
                if file.endswith('.png'):
                    print(f"  - {file}")
    else:
        print("\n❌ 图标生成失败!")
        print("请确保安装了Pillow库: pip install Pillow")

if __name__ == "__main__":
    main()