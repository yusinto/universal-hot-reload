import Express from 'express';

// server side rendering
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, createMemoryHistory, RouterContext} from 'react-router';
import { Provider } from 'react-redux';
import routes from '../universal/routes';
import createStore from '../universal/redux/store';

const PORT = 3000;
const app = Express();

app.use('/dist', Express.static('dist', {maxAge: '1d'}));

app.use((req, res) => {
  const history = createMemoryHistory(req.path);
  const store = createStore();

  const matchParams = {
    history,
    routes,
    location: req.originalUrl
  };

  match(matchParams, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const reactString = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );

      const reduxState = store.getState();

      const html = `<!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Universal Hot Reload</title>
                        <script>
                            window.__INITIAL_STATE__ = ${JSON.stringify(reduxState)};
                        </script>
                      </head>
                      <body>
                        <div id="reactDiv">${reactString}</div>
                        <script type="application/javascript" src="http://localhost:3002/dist/bundle.js"></script>
                      </body>
                    </html>`;

      res.end(html);
    } else {
      res.status(404).send('Not found');
    }
  });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});

// export httpServer object so universal-hot-reload can access it
module.exports = httpServer;
