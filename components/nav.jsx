import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: 250,
  },
  paper: {
    backgroundColor: 'white',
  },
};

const links = [
  { href: '/nba-streams', label: 'NBA' },
  { href: '/nfl-streams', label: 'NFL', disabled: true },
  { href: '/mlb-streams', label: 'MLB', disabled: true },
].map((link) => {
  const res = Object.assign({}, link, {
    key: `nav-link-${link.href}-${link.label}`,
  });
  return res;
});

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideBarOpened: false,
    };
  }

  toggleDrawer(open) {
    return () => this.setState({ sideBarOpened: !!open });
  }

  render() {
    const { classes, title } = this.props;
    const { sideBarOpened } = this.state;
    const sideList = (
      <div className={classes.list}>
        <List>
          {links.map(props => (
            <ListItem button component="a" disabled={props.disabled} key={props.key} href={props.href}>
              <ListItemText primary={`${props.label} ${props.disabled ? '(work in progress...)' : ''}`} />
            </ListItem>
          ))}
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={this.toggleDrawer(true)}
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          open={sideBarOpened}
          classes={{ paper: classes.paper }}
          onClose={this.toggleDrawer(false)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}


export default withStyles(styles)(Nav);
