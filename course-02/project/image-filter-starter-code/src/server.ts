import express from 'express';
import {Request, Response, NextFunction} from "express";
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Filter Image Endpoint
  app.get('/filteredimage/', async (req: Request, res: Response, next: NextFunction) => {
    
    let { image_url } = req.query;

      // check url is valid
      if (!image_url) {
          return res.status(400).send({ message: 'Missing Image URL' });
      }

      try {
        if ( typeof image_url !== "string" ) {
          res.status(500).json({ error: 'Image URL is invalid.' });
          return;
        }

        let filtered_path: string = await filterImageFromURL(image_url) as string;

        res.status(200).sendFile(filtered_path);
        res.on('finish', () => deleteLocalFiles([filtered_path]));
      } catch (error) {
        next(error)
      }

  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();