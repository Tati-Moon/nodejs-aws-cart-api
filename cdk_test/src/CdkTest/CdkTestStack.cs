using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using Amazon.CDK;
using Amazon.CDK.AWS.Lambda;
using Amazon.CDK.AWS.Lambda.Nodejs;
using Constructs;

namespace CdkTest
{
    public class CdkTestStack : Stack
    {
        private readonly string[] _allowHeaders =
            { "Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key", "X-Amz-Security-Token" };

        internal CdkTestStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            var appSettings = GetConfig();

            var environment = new Dictionary<string, string>
            {
                { "DATABASE_HOST", appSettings.Settings.Host },
                { "DATABASE_PORT", appSettings.Settings.Port },
                { "DATABASE_NAME", appSettings.Settings.Database },
                { "DATABASE_USER",  appSettings.Settings.User },
                { "DATABASE_PASSWORD",  appSettings.Settings.Password }
            };

            var server = new NodejsFunction(this, "server", new NodejsFunctionProps
            {
                FunctionName = "nodejs-aws-cart-api",
                Entry = "../dist/main.lambda.js",
                Timeout = Duration.Seconds(10),
                MemorySize = 1024,
                Runtime = Runtime.NODEJS_LATEST,
                Environment = environment,
                Bundling = new Amazon.CDK.AWS.Lambda.Nodejs.BundlingOptions
                {
                    ExternalModules = new[] { "@nestjs/microservices", "@nestjs/websockets", "class-transformer", "class-validator" }
                }
            });

            var functionUrl = server.AddFunctionUrl(new FunctionUrlOptions
            {
                AuthType = FunctionUrlAuthType.NONE,
                Cors = new FunctionUrlCorsOptions
                {
                    AllowedOrigins = new[] { "*" },
                    AllowedMethods = new[] { HttpMethod.GET, HttpMethod.DELETE, HttpMethod.PUT, HttpMethod.POST },
                    AllowedHeaders = new[] { "*" }
                }
            });

            new CfnOutput(this, "Url", new CfnOutputProps
            {
                Value = functionUrl.Url
            });
        }

        private static AppSettings GetConfig()
        {
            string configFilePath = "../appsettings.json";
            string jsonContent = File.ReadAllText(configFilePath);
            return JsonSerializer.Deserialize<AppSettings>(jsonContent);
        }
    }
}
