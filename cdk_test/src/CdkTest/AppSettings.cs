namespace CdkTest
{
    public class AppSettings
    {
        public AppSettingsSection Settings { get; set; }
    }

    public class AppSettingsSection
    {
        public string Host { get; set; }
        public string Port { get; set; }
        public string Database { get; set; }
        public string User { get; set; }
        public string Password { get; set; }
    }
}