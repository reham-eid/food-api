interface createVendorInput {
  name : string
  ownerName: string
  foodType: [string]
  pinCode: string
  address: string
  phone: string
  email: string
  password: string
}

interface updateVendorInput {
  address:string 
  name:string
  phone:string
  foodType:[string]
}

interface loginVendorInput {
  email:string
  password:string
}

interface vendorPayload {
  _id:string 
  name:string
  email:string
  foodType:[string]
}

export {
  createVendorInput,
  updateVendorInput,
  loginVendorInput,
  vendorPayload
}