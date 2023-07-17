import { AddListingJob, AddListingData } from "../AddListing.job";

import { FlowCapturedEvent } from "../types";

interface MomentListed {
    id: number;
    price: number;
    seller: string;
}



export class TopShotMomentListed extends AddListingJob {

    constructor(public payload: Record<string, unknown>) {
        super(payload);
    }

   preDataTransform(_data: FlowCapturedEvent<MomentListed>): FlowCapturedEvent<AddListingData> {
    
        const now  = new Date(Date.now())
        now.setFullYear(now.getFullYear() + 1)
        const tfData: FlowCapturedEvent<AddListingData> =  {
                ..._data,
                data: {
                    storefrontAddress: _data.data.seller,
                    listingResourceID: _data.data.id,
                    nftType: {
                        typeID: 'A.0b2a3299cc857e29.TopShot.NFT'
                    },
                    salePaymentVaultType: {
                        typeID: 'A.ead892083b3e2c6c.DapperUtilityCoin.Vault'
                    },
                    nftUUID: _data.data.id,
                    nftID: _data.data.id,
                    salePrice: _data.data.price.toString(),
                    expiry: now.getTime()
                } 
        }  
    
        return tfData;
    } 
   
}