import { message } from "@permaweb/ao-connect";
import { isValidUrl } from "../utils/helper";
import { createDataItemSigner } from "@permaweb/ao-connect";
import { WALLET_FILE } from "../constants/vars";
import axios, { AxiosResponse } from "axios";
import { StructuredEdge } from "../types/utils.types";


export const processData = async (item: StructuredEdge) => {
    const processId = item.tags['Recipient'] || '';
    const url = item.tags['Url'];
    const action = item.tags['Action']

    if (!url) return;
    try {

        if (!isValidUrl(url)) {
            return message({
                process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
                signer: createDataItemSigner(WALLET_FILE),
                tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Content-Type", value: "text/html" }],
                data: "The url is no valid."
            });
        }
        let responseData: AxiosResponse
        if (action === 'Get-Data') responseData = await axios.get(url);
        else if (action === 'Post-Data') {
            const body = item.tags['RequestBody']

            if (action === 'Post-Data' && !body) {
                return message({
                    process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
                    signer: createDataItemSigner(WALLET_FILE),
                    tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Content-Type", value: "text/html" }],
                    data: "Post request must contain a body"
                });
            }

            responseData = await axios.post(url, body)
        }

        console.info("Fetching url: ", url)
        const { headers, data, status } = responseData

        const messageData = {
            process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
            signer: createDataItemSigner(WALLET_FILE),
            tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Status", value: `${status}` }, { name: "Content-Type", value: headers['content-type'] || 'text/html' }],
            data: headers['content-type'] && headers['content-type'].includes('application/json') ? JSON.stringify(data) : String(data)
        };
        return message(messageData);
    } catch (error) {
        throw error
    }
};



// const processDataByActionTag = {
//     processGetData: async (item) => {
//         const processId = item['Recipient'] || '';
//         const url = item['Url'];

//         if (!url) return;
//         try {

//             if (!isValidUrl(url)) {
//                 return message({
//                     process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
//                     signer: createDataItemSigner(WALLET_FILE),
//                     tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Content-Type", value: "text/html" }],
//                     data: "The url is no valid."
//                 });
//             }


//             console.info("Fetching url: ", url)
//             const { headers, data, status } = await axios.get(url);

//             const messageData = {
//                 process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
//                 signer: createDataItemSigner(WALLET_FILE),
//                 tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Status", value: `${status}` }, { name: "Content-Type", value: headers['content-type'] || 'text/html' }],
//                 data: headers['content-type'] && headers['content-type'].includes('application/json') ? JSON.stringify(data) : String(data)
//             };
//             return message(messageData);
//         } catch (error) {
//             throw error
//         }
//     },
//     processPostData: async (item) => {
//         const processId = item['Recipient'] || '';
//         const url = item['Url'];
//         const body = item['RequestBody']
//         const action = item['Action']

//         if (!url) return;
//         try {

//             if (!isValidUrl(url)) {
//                 return message({
//                     process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
//                     signer: createDataItemSigner(WALLET_FILE),
//                     tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Content-Type", value: "text/html" }],
//                     data: "The url is no valid."
//                 });
//             }
//             if (action === 'Post-Data' && !body) {
//                 return message({
//                     process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
//                     signer: createDataItemSigner(WALLET_FILE),
//                     tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Content-Type", value: "text/html" }],
//                     data: "Post request must contain a body"
//                 });
//             }

//             console.info("Fetching url: ", url)
//             const { headers, data, status } = await axios.post(url, body);

//             const messageData = {
//                 process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
//                 signer: createDataItemSigner(WALLET_FILE),
//                 tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Status", value: `${status}` }, { name: "Content-Type", value: headers['content-type'] || 'text/html' }],
//                 data: headers['content-type'] && headers['content-type'].includes('application/json') ? JSON.stringify(data) : String(data)
//             };
//             return message(messageData);
//         } catch (error) {
//             throw error
//         }
//     }
// }