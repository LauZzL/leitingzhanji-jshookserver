# 代码仍在编写中，预计在国庆版本更新后完成。

## 声明

本项目仅适用于`雷霆战机`小程序。

本项目仅供学习交流使用，请勿用于商业、非法用途。转载请注明出处。

## 前言

使用`js hook`来获取雷霆战机加密前的数据和解密后的数据，简化抓包过程。

同样可以使用`js hook`来实现对数据的修改，从而达到像`SunnyNetTools`、`HttpCanary`等抓包工具的规则替换效果。

使用`js hook`无需考虑加解密算法，只需关注数据格式即可。

## 使用方法

我们提供了`nodejs`、`Python`、`Java`、`Golang`版本的服务端，请根据需要选择。

1. 下载对应版本的服务端，解压到非中文目录。
2. 安装必要的依赖。
3. 启动服务端。
4. 下载`js hook`代码
5. 使用`WeChatOpenDevTools`打开对应小程序的控制台
6. 在控制台输入`js hook`代码

当完成以上步骤后，你可以在对应服务端上看到请求数据，并且你可以修改`js hook`的一些代码实现对数据修改。

## 修改数据

我们在`js hook`代码中添加了修改数据的功能，你可以在`js hook`代码中修改`modifyRequestData`、`modifyResponseData`变量，实现对数据修改。

## 预览

### 数据监听

![http](httplisten.png)

### 数据修改

![modify](modify.png)

## 参考

- [https://github.com/JaveleyQAQ/WeChatOpenDevTools-Python](https://github.com/JaveleyQAQ/WeChatOpenDevTools-Python)