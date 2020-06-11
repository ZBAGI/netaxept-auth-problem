import * as soap from "soap";
import { Client as SoapClient } from "soap";

export class NetaxeptClient {
	private static soapClient: SoapClient | undefined;
	private get client(): Promise<SoapClient> {
		if(NetaxeptClient.soapClient)
			return Promise.resolve(NetaxeptClient.soapClient);
		
		return soap.createClientAsync("https://test.epayment.nets.eu/netaxept.svc?wsdl");
	}

	private readonly merchantId: string;
	private readonly token: string;
	private readonly redirectUrl: string;

	public constructor(merchantId: string, token: string, redirectUrl: string) {
		this.merchantId = merchantId;
		this.token = token;
		this.redirectUrl = redirectUrl;
	}

	public async createTransaction(): Promise<string> {
		return (await this.client).RegisterAsync({
			Token: this.token,
			merchantId: this.merchantId,
			Order: {
				OrderNumber: "example",
				Amount: 100,
				CurrencyCode: "NOK",

				Environment: {
				/* Not really but netaxept does not have JS / nodejs yet */
					WebServicePlatform: "PHP5"
				},
				Terminal: {
					Language: "no_NO",
					RedirectUrl: this.redirectUrl
				}
			}
		});
	}
}

const netaxept = new NetaxeptClient("[MERCHANT_ID]", "[TOKEN]", "http://example.com");
netaxept.createTransaction().then(() => {
	console.log("SUCCESS !");
}).catch((err) => {
	console.log(err);
	console.log("error :-/");
});