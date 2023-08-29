namespace Microsoft.TeamsAI
{
    public class AuthenticationOptions
    {
        public string? ConnectionName { get; set; }
        public string? Text { get; set; }
        public string? Title { get; set; }


        public string? AuthorityHost { get; set; }
        public string? TenantId { get; set; }
        public string? ClientId { get; set; }
        public string? ClientSecret { get; set; }
        public string? InitialEndpoint { get; set; }
        public string? Scopes { get; set; }

        public int Timeout { get; set; }
        public bool EndOnInvalidMessage { get; set; }

        /// <summary>
        /// Initialize the authentication option to use Azure Bot Service OAuth Connections which stores your token in the cloud
        /// </summary>
        /// <param name="connectionName">The name of OAuth connection</param>
        /// <param name="text">Text displayed to user when login</param>
        /// <param name="title">Title displayed to user when login</param>
        /// <param name="timeout">End the login after the given milliseconds. Defaults to 60000</param>
        /// <param name="endOnInvalidMessage">End the login if the application receives invalid message during login process. Defaults to true</param>
        public AuthenticationOptions(string connectionName, string text, string title, int timeout = 60000, bool endOnInvalidMessage = true)
        {
            ConnectionName = connectionName;
            Text = text;
            Title = title;
            Timeout = timeout;
            EndOnInvalidMessage = endOnInvalidMessage;
        }

        /// <summary>
        /// Initialize the authentication option to handle SSO in your own application with more flexibility
        /// </summary>
        /// <param name="authorityHost">The host name of AAD authority</param>
        /// <param name="tenantId">The AAD tenant id</param>
        /// <param name="clientId">The client(application) id of your AAD app</param>
        /// <param name="clientSecret">The client(application) secret of your AAD app</param>
        /// <param name="initialEndpoint">The url of login page when user login is required</param>
        /// <param name="scope">The required OAuth permission for your application</param>
        /// <param name="timeout">End the login after the given milliseconds. Defaults to 60000</param>
        /// <param name="endOnInvalidMessage">End the login if the application receives invalid message during login process. Defaults to true</param>
        public AuthenticationOptions(string authorityHost, string tenantId, string clientId, string clientSecret, string initialEndpoint, string scope, int timeout = 60000, bool endOnInvalidMessage = true)
        {
            AuthorityHost = authorityHost;
            TenantId = tenantId;
            ClientId = clientId;
            ClientSecret = clientSecret;
            InitialEndpoint = initialEndpoint;
            Scopes = scope;
            Timeout = timeout;
            EndOnInvalidMessage = endOnInvalidMessage;
        }
    }
}
