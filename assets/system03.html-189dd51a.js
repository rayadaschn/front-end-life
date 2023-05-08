import{_ as t,X as a,Y as d,Z as r,V as c,W as v,F as o,$ as u}from"./framework-2060dede.js";const m={},n=a,e=d,p=o,s=r,l=u,b=c,h=v,_=n("h1",{id:"数据加密原理",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#数据加密原理","aria-hidden":"true"},"#"),e(" 数据加密原理")],-1),f={href:"https://cloud.tencent.com/developer/article/1738898",target:"_blank",rel:"noopener noreferrer"},g={href:"https://segmentfault.com/a/1190000024523772",target:"_blank",rel:"noopener noreferrer"},S=l("<p>1、前端加密方式：</p><ul><li>https，安全性高。证书认证，一种是来自于证书颁发机构；一种是自己生成证书，但需要浏览器添加信任；成本高。</li><li>post 之前，通过 js 对密码进行加密。前端 js：md5+salt(随机数),后台服务器 php : 截取 salt 后的数与数据库的密码进行比较；生成密码:md5()</li><li>用 RSA 进行加密传输</li><li>使用密码空间，进行加密传输</li><li>有服务端颁发并验证一个带有时间戳的可信 token</li></ul><p>2、加密方法：</p><ul><li><strong>AES</strong></li><li><strong>RSA</strong></li><li>MD5</li><li>BASE64</li><li><strong>SM4</strong></li></ul><p>其中，MD5 是有损压缩，生成固定的 128 位数列值，并且不可还原。多用于文件完整性验证、口令加密和数字签名中。一般利用 MD5 作为 Hash 函数，对摘要进行加密；(如果数据量大的时候计算数字签名将会比较耗时，所以一般做法是先将原数据进行 Hash 运算，得到的 Hash 值就叫做「摘要」)</p>",5),y={href:"https://juejin.cn/post/7013271260595486757",target:"_blank",rel:"noopener noreferrer"},k=l(`<p>BASE64 是转码方法，二进制字节序列转化为 ASCII 字符序列。</p><p>2、非对称 RSA 加密原理:</p><ol><li><p>后端先给前端发放一个公钥（public-key）</p></li><li><p>前端使用公钥对密码（password）等敏感字段进行加密</p></li><li><p>前端使用 post 方式将使用公钥加密后的密码发送到后端</p></li><li><p>后端使用私钥（private-key）进行解密，获得原密码</p></li></ol><p>原理过程:</p><p>1.客户端需要生成一个对称加密的密钥 1，传输内容与该密钥 1 进行对称加密传给服务端;</p><p>2.并且把密钥 1 和公钥进行非对称加密，然后也传给服务端;</p><p>3.服务端通过私钥把对称加密的密钥 1 解密出来，然后通过该密钥 1 解密出内容。</p><p>以上是客户端到服务端的过程。</p><p>如果是服务端要发数据到客户端，就需要把响应数据跟对称加密的密钥 1 进行加密，然后客户端接收到密文，通过客户端的密钥 1 进行解密，从而完成加密传输。</p><div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre class="language-JavaScript"><code>/*
 * @Discription: 封装网络请求方法
 * @Company:
 * @Date: 2022-01-24 10:00:00
 */

import CryptoJS from &quot;./crypto.js&quot;

 //测试环境key 公钥
const key = &#39;****************************&#39;;

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
        &#39;content-type&#39;: &#39;application/json;charset=utf-8&#39;
      }
    let sign = getSign(data);
    header[&#39;x-sign&#39;] = sign;

    return header;
}
/**
 * 请求get方法
 * url
 * data 以对象的格式传入
 */
function request(url,data,success,fail=refail){
	let header = DealWithHeader(data);
	// header[&#39;Authorization&#39;] = token;
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10);function B(q,x){const i=p("ExternalLinkIcon");return b(),h("div",null,[_,n("p",null,[e("常用的是将对称加密同非对称加密相结合。各自具体原理，可见《"),n("a",f,[e("前端敏感数据加密方案及实现"),s(i)]),e("》、《"),n("a",g,[e("数字签名和数字证书"),s(i)]),e("》。")]),S,n("p",null,[n("a",y,[e("MD5 和 SHA 等的区别"),s(i)]),e(": SHA 安全性更高。")]),k])}const D=t(m,[["render",B],["__file","system03.html.vue"]]);export{D as default};
