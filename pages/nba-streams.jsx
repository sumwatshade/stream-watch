import React from 'react';
import fetch from 'isomorphic-unfetch';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Head from '../components/head';
import Game from '../components/game';

// import mockRes from '../test/sample';
// import mockPosts from '../test/posts';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background,
    minHeight: '100vh',
  },
});
const Index = (props) => {
  const { classes: { root }, streamData } = props;
  const games = streamData.filter(o => (o.title.indexOf('Game Thread') >= 0));

  const Games = games.length > 0 ? games.map(o => (
    <Game key={`game-${o.title}`} gameData={o} />
  )) : (
    <Grid item>
      <Typography variant="h3">No games were found</Typography>
    </Grid>
  );
  return (
    <React.Fragment>
      <Head title="NBA Games" />
      <Grid container direction="column" alignItems="center" spacing={8} className={root}>
        <Grid item>
          <Typography variant="h1">NBA Games</Typography>
        </Grid>
        {Games}
      </Grid>
    </React.Fragment>

  );
};

Index.getInitialProps = async function getInit() {
  let res;
  try {
    res = await fetch('https://www.reddit.com/r/nbastreams.json');
    // const res = mockRes;
  } catch (e) {
    // console.error(e);
    // res = mockRes;
  }

  const jsonResponse = await res.json();
  const posts = jsonResponse.data.children.map((c) => {
    const {
      title, author, url, permalink,
    } = c.data;
    return {
      title,
      author,
      url,
      permalink,
    };
  });


  // For each game, find a comment made by the bot that posts stream data
  return {
    streamData: posts,
    raw: jsonResponse,
  };
};

export default withStyles(styles)(Index);
