using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace AdSeeDataSpider
{
    public class CHttpRequest
    {
        public static HttpWebRequest createHttpWebRequest(string url, int overTime, string methodType)
        {
            HttpWebRequest webRequest = null;
            try
            {
                webRequest = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(url));
                webRequest.Timeout = overTime;
                webRequest.Method = methodType.ToUpper();
                webRequest.ContentType = "application/x-www-form-urlencoded";
                return webRequest;
            }
            catch
            {
                return null;
            }
        }

		public static string getHttpWebRequest(string url, string parameter, Encoding encoder, out string errorMessage)
        {
            byte[] data = null;
            Stream newStream = null;
            StreamReader reader = null;
            string content = null;
            HttpWebRequest webRequest = null;
			errorMessage = "";
            webRequest = CHttpRequest.createHttpWebRequest(url, 30000, "POST");
            if (webRequest == null)
            {
				errorMessage = "create webrequest faild.";
                return null;
            }

            UTF8Encoding encoding = new UTF8Encoding();
            try
            {
                data = encoding.GetBytes(parameter);
                webRequest.ContentLength = data.Length;
                newStream = webRequest.GetRequestStream();
                newStream.Write(data, 0, data.Length);                
            }
            catch (Exception ex)
            {
				errorMessage = string.Format("Get request faild,error message<{0}>.",ex.Message);
                return null;
            }
            finally
            {
                if (newStream != null)
                {
                    newStream.Close();
                    newStream.Dispose();
                    newStream = null;
                }
            }

            try
            {
                HttpWebResponse myResponse = (HttpWebResponse)webRequest.GetResponse();
                reader = new StreamReader(myResponse.GetResponseStream(), Encoding.UTF8);
                content = reader.ReadToEnd();                
                return content.Replace("\ufeff", "");
            }
            catch (Exception ex)
            {
				errorMessage = string.Format("Read response stream faild,url<{0}>, error message<{1}>.", url, ex.Message);
                return null;
            }
            finally
            {
                if (reader != null)
                {
                    reader.Close();
                    reader.Dispose();
                    reader = null;
                }
            }
        }

		public static string GetHttpWebRequest(string url, out string errorMessage)
        {
			errorMessage = "";
            try
            {
                Uri uri = new Uri(url);
                HttpWebRequest myReq = (HttpWebRequest)WebRequest.Create(uri);
                myReq.UserAgent = "User-Agent:Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705";
                myReq.Accept = "*/*";
                myReq.KeepAlive = true;
                myReq.Headers.Add("Accept-Language", "zh-cn,en-us;q=0.5");
                HttpWebResponse result = (HttpWebResponse)myReq.GetResponse();
                Stream receviceStream = result.GetResponseStream();
                StreamReader readerOfStream = new StreamReader(receviceStream, System.Text.Encoding.Default);
                string strHTML = readerOfStream.ReadToEnd();
                readerOfStream.Close();
                receviceStream.Close();
                result.Close();

                return strHTML;
            }
            catch (Exception ex)
            {
				errorMessage = string.Format("Get data has some error,error message<{0}>.", ex.Message);
                return null;
            }
        }

        public static string GetWebRequest(string url, Encoding encoder)
        {
            WebRequest myReq = null;
            Uri uri = null;
            WebResponse result = null;
            Stream receviceStream = null;
            StreamReader readerOfStream = null;
            try
            {
                uri = new Uri(url);
            }
            catch
            {
                return null;
            }

            try
            {
                myReq = WebRequest.Create(uri);
            }
            catch
            {
                return null;
            }

            try
            {
                result = myReq.GetResponse();
            }
            catch
            {
                return null;
            }

            try
            {
                receviceStream = result.GetResponseStream();
            }
            catch
            {
                return null;
            }

            try
            {

                readerOfStream = new StreamReader(receviceStream, encoder);
                string strHTML = readerOfStream.ReadToEnd();
                
                return strHTML;
            }
            catch
            {
                return null;
            }
            finally
            {
                readerOfStream.Close();
                receviceStream.Close();
                result.Close();
            }
        }

        public static string GetHtmlCode(string url)
        {
            string htmlCode;
            HttpWebRequest webRequest = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
            webRequest.Timeout = 30000;
            webRequest.Method = "GET";
            webRequest.UserAgent = "Mozilla/4.0";
            webRequest.Headers.Add("Accept-Encoding", "gzip, deflate, sdch");
            HttpWebResponse webResponse = (System.Net.HttpWebResponse)webRequest.GetResponse();
            if (webResponse.ContentEncoding.ToLower() == "gzip")//如果使用了GZip则先解压            
            {
                using (System.IO.Stream streamReceive = webResponse.GetResponseStream())
                {
                    using (var zipStream =
                        new System.IO.Compression.GZipStream(streamReceive, System.IO.Compression.CompressionMode.Decompress))
                    {
                        using (StreamReader sr = new System.IO.StreamReader(zipStream, Encoding.Default))
                        {
                            htmlCode = sr.ReadToEnd();
                        }
                    }
                }
            }
            else
            {
                using (System.IO.Stream streamReceive = webResponse.GetResponseStream())
                {
                    using (System.IO.StreamReader sr = new System.IO.StreamReader(streamReceive, Encoding.Default))
                    {
                        htmlCode = sr.ReadToEnd();
                    }
                }
            }

            return htmlCode;
        }

        public static string calStreamMd5(Stream stream)
        {
            MD5CryptoServiceProvider md5CSP = new MD5CryptoServiceProvider();
            byte[] md5data = md5CSP.ComputeHash(stream);            
            md5CSP.Clear();
            string str = "";
            for (int i = 0; i < md5data.Length - 1; i++)
            {
                str += md5data[i].ToString("x").PadLeft(2, '0');
            }

            return str.ToUpper();
        }

        public static string calStringMd5(string stringValue)
        {
            MD5CryptoServiceProvider md5CSP = new MD5CryptoServiceProvider();
            System.Text.ASCIIEncoding  encoding=new System.Text.ASCIIEncoding();
            byte[] stringByteValue = encoding.GetBytes(stringValue);
            byte[] md5data = md5CSP.ComputeHash(stringByteValue);
            md5CSP.Clear();
            string str = "";
            for (int i = 0; i < md5data.Length - 1; i++)
            {
                str += md5data[i].ToString("x").PadLeft(2, '0');
            }

            return str.ToUpper();
        }

        public static long downloadImageFile(string url, string fileName, string userAgent)
        {            

            HttpWebRequest webRequest = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
            webRequest.Timeout = 30000;
            webRequest.Method = "GET";
            webRequest.UserAgent = userAgent;            
            HttpWebResponse webResponse = (System.Net.HttpWebResponse)webRequest.GetResponse();
            if (webResponse.ContentEncoding.ToLower() == "gzip")//如果使用了GZip则先解压            
            {
                using (System.IO.Stream streamReceive = webResponse.GetResponseStream())
                {
                    using (var zipStream =
                        new System.IO.Compression.GZipStream(streamReceive, System.IO.Compression.CompressionMode.Decompress))
                    {
                        using (StreamReader sr = new System.IO.StreamReader(zipStream, Encoding.Default))
                        {
                            return writeStreamData2File(fileName, sr.BaseStream);
                        }
                    }
                }
            }
            else
            {
                using (System.IO.Stream streamReceive = webResponse.GetResponseStream())
                {
                    using (StreamReader sr = new System.IO.StreamReader(streamReceive, Encoding.Default))
                    {
                        return writeStreamData2File(fileName, streamReceive);
                    }
                }
            }
        }

        public static long writeStreamData2File(string fileName, Stream inputStream)
        {
            byte[] buffer = new byte[4096];
            int pos = 0;
            int readLength = 0;
            FileStream imageFileStream = new FileStream(fileName, FileMode.Create, FileAccess.Write);
            BinaryWriter imageWriter = new BinaryWriter(imageFileStream);
            try
            {                
                while (true)
                {
                    readLength = inputStream.Read(buffer, 0, buffer.Length);
                    if (readLength > 0)
                    {
                        imageWriter.Write(buffer, 0, readLength);
                        pos += readLength;
                    }
                    else
                    {
                        break;
                    }
                }

            }
            finally
            {
                inputStream.Close();
                inputStream.Dispose();
                inputStream = null;

                imageWriter.Flush();
                imageWriter.Close();
                imageWriter = null;

                imageFileStream.Close();
                imageFileStream.Dispose();
                imageFileStream = null;
            }

            return pos;
        }

		public static string getHtmlContent(string url, string charSet, CNetProxy netProxy, out string errorMessage)
        {
			errorMessage = "";
            string strWebData = string.Empty;
            try
            {
                WebClient webClient = new WebClient(); //创建WebClient实例
                webClient.Headers.Add("user-agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36");
                webClient.Credentials = CredentialCache.DefaultCredentials;
                if (netProxy != null)
                {
                    webClient.Proxy = new WebProxy(netProxy.IpAddress, netProxy.Port);
                }
                byte[] myDataBuffer = webClient.DownloadData(url);
                strWebData = System.Text.Encoding.Default.GetString(myDataBuffer);
                //获取网页字符编码描述信息
                if (string.IsNullOrEmpty(charSet))
                {
                    Match charSetMatch = Regex.Match(strWebData, "<meta([^>]*)charset=(\")?(.*)?\"", RegexOptions.IgnoreCase | RegexOptions.Multiline);
                    string webCharSet = charSetMatch.Groups[3].Value.Trim().ToLower();
                    if ((webCharSet != "gb2312") && (webCharSet != "gbk2312"))
                    {
                        webCharSet = "utf-8";
                    }

                    if (System.Text.Encoding.GetEncoding(webCharSet) != System.Text.Encoding.Default)
                    {
                        strWebData = System.Text.Encoding.GetEncoding(webCharSet).GetString(myDataBuffer);
                    }
                }
            }
            catch (Exception ex)
            {
				errorMessage = string.Format("Get html content faild, error message<{0}>, netProxy<{1}>.", ex.Message, netProxy);
                return null;
            }

            return strWebData;
        }

		public static string getHtmlContentUseCWebClicent(string url, Encoding ecoder, CNetProxy netProxy, out string errorMessage)
        {
			errorMessage = "";
            CWebClient webClient = null;
            try
            {
                webClient = new CWebClient(10000); //创建WebClient实例
                webClient.Headers.Add("user-agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36");
                webClient.Credentials = CredentialCache.DefaultCredentials;
                if (netProxy != null)
                {
                    webClient.Proxy = new WebProxy(netProxy.IpAddress, netProxy.Port);

                }
                byte[] myDataBuffer = webClient.DownloadData(url);
                return ecoder.GetString(myDataBuffer);

            }
            catch (Exception ex)
            {
				errorMessage = string.Format("Get page content faild,net proxy<{0}>, error message<{1}>.", netProxy, ex.Message);
                return null;
            }
            finally
            {
                if (webClient != null)
                {
                    webClient.Dispose();
                    webClient = null;
                }
            }
        }
    }

    public class CWebClient : WebClient
    {
        private int _timeout;
        /// <summary>
        /// 超时时间(毫秒)
        /// </summary>
        public int Timeout
        {
            get
            {
                return _timeout;
            }
            set
            {
                _timeout = value;
            }
        }

        public CWebClient()
        {
            this._timeout = 60;
        }

        public CWebClient(int timeOut)
        {
            this._timeout = timeOut;
        }

        protected override WebRequest GetWebRequest(Uri address)
        {
            var result = base.GetWebRequest(address);
            result.Timeout = this._timeout;
            return result;
        }
    }
}
