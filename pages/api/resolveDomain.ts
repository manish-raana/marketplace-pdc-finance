import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  
  if (req.method == 'POST') { 
      res.status(500).json({ error: 'Not a valid request!' });
      return;
  } else {
    //console.log(req.query)
    if(!req.query.domain){
      res.status(200).json({ error: 'Not a valid request!' });
      return
    }
    var config = {
      method: "get",
      url: `https://resolve.unstoppabledomains.com/domains/${req.query.domain}`,
      headers: {
        Authorization: `Bearer ${process.env.UD_API_TOKEN}`,
      },
    };
  
    try {
      const response = await axios(config);
      //console.log("response: ", response.data);
      res.status(200).json(response.data);
    } catch (error:any) {
      //console.error(error)
      res.status(400).json({ error: error });
    }
  }
}
