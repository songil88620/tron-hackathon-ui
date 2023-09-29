export interface Safe {
  emissary: string,
  owner: string,
  name: string,
  desc: string,
  asset: string,
  recipient: string,
  controllers: Approver[],
  approver: string,
  lump_check: boolean,
  lump_amount: {
    amount: string,
    token: string,
    hash: string,
    approved: number
  },
  mile_check: boolean,
  milestones: {
    amount: string,
    token: string,
    hash: string,
    approved: number
  }[]
  created: string
}

export interface Asset {
  name: string,
  img: string,
  address: string
}

export interface Controller {
  address: string,
  role: string
}

export interface Emissary {
  owner: string,
  name: string,
  domain: string,
  theme: number,
  img: string,
  assets: Asset[],
  code: string,
  controllers: Controller[],
  nft: {
    everyone: boolean,
    holder: boolean,
    contract: string,
    network: string
  },
  created: string
}

export interface Approver {
  address: string,
  data: {
    approved: boolean,
    at: string
  }[]
}

export interface Requests {
  _id: string,
  emissary: string,
  owner: string,
  name: string,
  program: {
    pid: string,
    program: string
  },
  amount: {
    amount: string,
    token: string
  },
  state: string,
  hash: string,
  created: string
}

export interface Props {
  side: boolean,
  role: string,
  emissary: string,
  subdomain: string,
  connected: boolean,
  address: string,
  connectWallet: any,
  provider: any
}
 