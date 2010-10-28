/******************************************************************
Copyright (c) 2001-2010
文 件 名: authnum-lib.h
作    者: 刘宇  liuyu@jltx.com
版    本: v3.11
完成日期: 2010.05.17
文件说明: 本文件定义了验证码生成及验证码识别函数。
其    它: 需要libpng、gd2库支持
          若需要支持其它字体，则需要freetype支持
函数列表: // 主要函数列表，每条记录应包括函数名及功能简要说明
	1.
历史记录:
	1.
	修改人: 刘宇
	版　本: v1.01
	日　期: 2010.05.17
	描　述: 定义验证码生成函数

//未来支持freetype库，验证码识别功能
******************************************************************/
#ifndef _AUTHNUM_LIB_
#define _AUTHNUM_LIB_ 1

// 缺省验证码位数
#define AUTHNUM_DEFAULT_DIGITS  4 

// 单验证码的宽和高
#define AUTHNUM_SINGLE_IMG_WIDTH  16 
#define AUTHNUM_SINGLE_IMG_HEIGHT 20 

// 验证码字符集数量
#define AUTHNUM_CHARSETS  3

char *authnum_create(int authnum_digits, int authnum_charsets, int authnum_bgcolor, int authnum_color, int authnum_offset, int authnum_disturb);

extern char *AUTHNUM_CHARS[3];

/*
字符集（汉字）-- 待实现
字体选择--需要freetype支持，待实现
*/

#endif
