        public static IList<SearchCompanyAccount> DeserializeJSONString(string JSONString)
        {
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(List<SearchCompanyAccount>));

            //MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(JSONString));
            using (MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(JSONString)))
            {
                return (IList<SearchCompanyAccount>)ser.ReadObject(stream);
            }
        }