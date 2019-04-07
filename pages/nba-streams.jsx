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
    maxWidth: '100%',
  },
});
const Index = (props) => {
  const { classes: { root }, streamData, lastUpdated } = props;
  const updatedTimeString = new Date(lastUpdated).toLocaleTimeString();
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
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={8}
        className={root}
      >
        <Grid item>
          <Typography variant="h1" color="primary">NBA Games</Typography>
        </Grid>
        {Games}
        <Grid item>
          <Typography variant="h5">
            {`Last updated: ${updatedTimeString}`}
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Index.getInitialProps = async function getInit() {
  let res;
  try {
    res = await fetch(
      'https://s3.amazonaws.com/nba-streams-bucket/posts.json',
    );
  } catch (e) {
    console.error(e);
  }

  const jsonRes = await res.json();
  let data;
  if (jsonRes && jsonRes.length) {
    data = {
      streamData: jsonRes,
    };
  } else {
    data = {
      streamData: jsonRes.posts,
      lastUpdated: jsonRes.lastUpdated,
    };
  }

  // For each game, find a comment made by the bot that posts stream data
  return data;
};

export default withStyles(styles)(Index);
