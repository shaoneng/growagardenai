import os

def rename_files_to_lowercase(folder_path):
    """
    将指定文件夹内的所有文件和子文件夹名称中的大写字母转换为小写字母。

    Args:
        folder_path: 目标文件夹的路径。
    """
    try:
        # 遍历文件夹中的所有文件和文件夹
        for filename in os.listdir(folder_path):
            # 构建完整的文件路径
            source = os.path.join(folder_path, filename)
            
            # 将文件名转换为小写
            destination = os.path.join(folder_path, filename.lower())

            # 如果新旧文件名不同，则进行重命名
            if source != destination:
                try:
                    os.rename(source, destination)
                    print(f'已重命名: "{filename}" -> "{filename.lower()}"')
                except OSError as e:
                    print(f'错误：重命名文件 "{filename}" 失败。 {e}')

    except FileNotFoundError:
        print(f'错误：找不到指定的文件夹路径 "{folder_path}"')
    except Exception as e:
        print(f'发生未知错误: {e}')

# --- 使用说明 ---
if __name__ == "__main__":
    # 1. 将下面的 "YOUR_FOLDER_PATH" 替换为你的目标文件夹的绝对或相对路径。
    #    - Windows 示例: r"C:\Users\YourUser\Documents\MyFolder"
    #    - macOS 或 Linux 示例: "/Users/YourUser/Documents/MyFolder"
    target_folder = "/Users/wushaoneng/Desktop/AI_project/growagarden/public/images/items"

    if target_folder == "YOUR_FOLDER_PATH":
        print("请先在代码中设置你的目标文件夹路径 (target_folder)。")
    else:
        print(f'开始处理文件夹: "{target_folder}"')
        rename_files_to_lowercase(target_folder)
        print("处理完成！")