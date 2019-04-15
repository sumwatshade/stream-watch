import React from 'react';
import parse from 'url-parse';
import { string } from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { Typography } from '@material-ui/core';


const styles = theme => ({
  link: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  url: {
    flexGrow: 1,
    color: theme.palette.text.primary,
    [theme.breakpoints.down('xs')]: {
      alignSelf: 'flex-start',
    },
  },
  author: {
    color: theme.palette.text.secondary,
    flexBasis: '30%',
    flexShrink: 0,
    [theme.breakpoints.down('xs')]: {
      alignSelf: 'flex-end',
    },
  },
});

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function parseUrl(url) {
  const { host, pathname } = parse(url);
  let res = `${host}${pathname}`;

  switch (host) {
    case 'bfst.to':
      res = `Buff Streams (${pathname})`;
      break;
    case 'ripple.is':
      res = `Ripple Streams (${pathname})`;
      break;
    case 'acesports.xyz':
      res = `Ace Sports (${pathname})`;
      break;
    case 'nba-live.stream':
      res = `Nba Live Streams (${pathname})`;
      break;
    default:
      break;
  }

  return res;
}
const StreamLink = ({ url, author, classes }) => {
  const urlContent = parseUrl(url);

  return (
    <ListItemLink className={classes.link} href={url} target="_blank" key={`link-${url}`}>
      <Typography className={classes.url}>{urlContent}</Typography>
      <Typography className={classes.author}>{`u/${author}`}</Typography>
    </ListItemLink>
  );
};

StreamLink.propTypes = {
  url: string,
  author: string,
};

StreamLink.defaultProps = {
  url: '',
  author: '',
};

export default withStyles(styles)(StreamLink);
