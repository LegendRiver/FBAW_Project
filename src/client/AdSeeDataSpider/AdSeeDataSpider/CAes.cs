using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using System.IO;

namespace AdSeeDataSpider
{
    public class AES
    {
        /// <summary>
        /// 获取向量
        /// </summary>
        private static string IV
        {
            get { return @"L+\~f4,Ir)b$=pkf"; }
        }

        /// <summary>
        /// AES加密
        /// </summary>
        /// <param name="plainStr">明文字符串</param>
        /// <returns>密文</returns>
		public static string AESEncrypt(string plainStr, string key, out string errorMessage)
        {
            byte[] bKey = Encoding.UTF8.GetBytes(key.Replace("-", ""));
            byte[] bIV = Encoding.UTF8.GetBytes(key.Substring(0, 16));
            byte[] byteArray = Encoding.UTF8.GetBytes(plainStr);
			errorMessage = "";
            Rijndael aes = Rijndael.Create();
            try
            {
                using (MemoryStream mStream = new MemoryStream())
                {
                    using (CryptoStream cStream = new CryptoStream(mStream, aes.CreateEncryptor(bKey, bIV), CryptoStreamMode.Write))
                    {
                        cStream.Write(byteArray, 0, byteArray.Length);
                        cStream.FlushFinalBlock();
                        return Convert.ToBase64String(mStream.ToArray());
                    }
                }
            }
            catch(Exception ex) 
            {             
				errorMessage = ex.Message;
                return null;
            }
            finally
            {
                aes.Clear();
                aes.Dispose();
                aes = null;
            }
        }


        /// <summary>
        /// AES解密
        /// </summary>
        /// <param name="encryptStr">密文字符串</param>
        /// <returns>明文</returns>
        public static string AESDecrypt(string encryptStr, string key)
        {
            byte[] bKey = Encoding.UTF8.GetBytes(key.Replace("-", ""));
            byte[] bIV = Encoding.UTF8.GetBytes(key.Substring(0, 16));
            byte[] byteArray = Convert.FromBase64String(encryptStr);

            Rijndael aes = Rijndael.Create();
            try
            {
                using (MemoryStream mStream = new MemoryStream())
                {
                    using (CryptoStream cStream = new CryptoStream(mStream, aes.CreateDecryptor(bKey, bIV), CryptoStreamMode.Write))
                    {
                        cStream.Write(byteArray, 0, byteArray.Length);
                        cStream.FlushFinalBlock();
                        return Encoding.UTF8.GetString(mStream.ToArray());
                    }
                }
            }
            catch
            {
                return null;
            }
            finally
            {
                aes.Clear();
                aes.Dispose();
                aes = null;
            }
        }
    }
}
