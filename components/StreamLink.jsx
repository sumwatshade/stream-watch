import React from 'react';
import parse from 'url-parse';
import { string } from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

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

const StreamLink = ({ url, author, classes }) => {
  const { host, pathname } = parse(url);
  return (
    <React.Fragment>
      <ListItemLink className={classes.link} href={url} key={`link-${pathname}`}>
        <Typography className={classes.url}>{`${host}${pathname}`}</Typography>
        <Typography className={classes.author}>{`u/${author}`}</Typography>
      </ListItemLink>
      <Divider />
    </React.Fragment>
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
