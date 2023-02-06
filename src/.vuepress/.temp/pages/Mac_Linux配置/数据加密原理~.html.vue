<template><div><h1 id="数据加密原理" tabindex="-1"><a class="header-anchor" href="#数据加密原理" aria-hidden="true">#</a> 数据加密原理</h1>
<p>常用的是将对称加密同非对称加密相结合。各自具体原理，可见《<a href="https://cloud.tencent.com/developer/article/1738898" target="_blank" rel="noopener noreferrer">前端敏感数据加密方案及实现<ExternalLinkIcon/></a>》、《<a href="https://segmentfault.com/a/1190000024523772" target="_blank" rel="noopener noreferrer">数字签名和数字证书<ExternalLinkIcon/></a>》。</p>
<p>1、前端加密方式：</p>
<ul>
<li>https，安全性高。证书认证，一种是来自于证书颁发机构；一种是自己生成证书，但需要浏览器添加信任；成本高。</li>
<li>post之前，通过js对密码进行加密。前端js：md5+salt(随机数),后台服务器php : 截取salt后的数与数据库的密码进行比较；生成密码:md5()</li>
<li>用RSA进行加密传输</li>
<li>使用密码空间，进行加密传输</li>
<li>有服务端颁发并验证一个带有时间戳的可信token</li>
</ul>
<p>2、加密方法：</p>
<ul>
<li><strong>AES</strong></li>
<li><strong>RSA</strong></li>
<li>MD5</li>
<li>BASE64</li>
<li><strong>SM4</strong></li>
</ul>
<p>其中，MD5是有损压缩，生成固定的128位数列值，并且不可还原。多用于文件完整性验证、口令加密和数字签名中。一般利用MD5作为Hash 函数，对摘要进行加密；(如果数据量大的时候计算数字签名将会比较耗时，所以一般做法是先将原数据进行 Hash 运算，得到的 Hash 值就叫做「摘要」)</p>
<p><a href="https://juejin.cn/post/7013271260595486757" target="_blank" rel="noopener noreferrer">MD5 和 SHA等的区别<ExternalLinkIcon/></a>: SHA安全性更高。</p>
<p>BASE64是转码方法，二进制字节序列转化为 ASCII 字符序列。</p>
<p>2、非对称RSA加密原理:</p>
<p>\1. 后端先给前端发放一个公钥（public-key）</p>
<p>\2. 前端使用公钥对密码（password）等敏感字段进行加密</p>
<p>\3. 前端使用post方式将使用公钥加密后的密码发送到后端</p>
<p>\4. 后端使用私钥（private-key）进行解密，获得原密码</p>
<p>原理过程:</p>
<p>1.客户端需要生成一个对称加密的密钥1，传输内容与该密钥 1进行对称加密传给服务端;</p>
<p>2.并且把密钥1和公钥进行非对称加密，然后也传给服务端;</p>
<p>3.服务端通过私钥把对称加密的密钥1解密出来，然后通过该密钥1解密出内容。</p>
<p>以上是客户端到服务端的过程。</p>
<p>如果是服务端要发数据到客户端，就需要把响应数据跟对称加密的密钥1进行加密，然后客户端接收到密文，通过客户端的密钥1进行解密，从而完成加密传输。</p>
<p>![image-20220704092124530](/Users/huangyi/Library/Application Support/typora-user-images/image-20220704092124530.png)</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>/*
 * @Discription: 封装网络请求方法
 * @Company: wasu
 * @Date: 2022-01-24 10:00:00
 */

import CryptoJS from &quot;./crypto.js&quot;

 //测试环境key 公钥
const key = '****************************';

function encryptByDES(message) {
    
	let hash = CryptoJS.HmacSHA256(message,CryptoJS.enc.Base64.parse(key));
	let hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
	return hashInBase64
}

function getSign(data){
	let _str = JSON.stringify(data);
	return encryptByDES(_str)
}
// 请求头处理函数
const DealWithHeader=(data)=&gt;{
    let header = {
        'content-type': 'application/json;charset=utf-8'
      }
    let sign = getSign(data);
    header['x-sign'] = sign;

    return header;
}
/**
 * 请求get方法
 * url
 * data 以对象的格式传入
 */
function request(url,data,success,fail=refail){
	let header = DealWithHeader(data);
	// header['Authorization'] = token;
	uni.request({
		url: url,
		data: JSON.stringify(data),
		method:&quot;POST&quot;,
		header:header,
		success: success,
		fail: fail
	});
}
function refail(e){
	uni.showToast({title:&quot;接口数据请求失败！&quot;,icon:&quot;none&quot;});
	// console.log(res)
	console.log(e)
}


/**
 * 输出请求模块
 */
export default{
	encryptByDES,
	request
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


