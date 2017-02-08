import React, {Component, PropTypes} from 'react';
import Button from '../base/Button';
import Link from '../base/Link';

import imgLight from '../../../static/themes/light.png';
import imgDark from '../../../static/themes/dark.png';
import imgDefault from '../../../static/themes/default.png';
import imgSolarizedLight from '../../../static/themes/solarized-light.png';
import imgSolarizedDark from '../../../static/themes/solarized-dark.png';
import imgSolarized from '../../../static/themes/solarized.png';
import imgRailscasts from '../../../static/themes/railscasts.png';
import imgPurple from '../../../static/themes/purple.png';
import imgMaterial from '../../../static/themes/material.png';
import * as session from '../../../sync/session';

const THEMES_PER_ROW = 3;
const THEMES = [
  {key: 'default', name: 'Insomnia', img: imgDefault},
  {key: 'light', name: 'Simple Light', img: imgLight},
  {key: 'dark', name: 'Simple Dark', img: imgDark},
  {key: 'purple', name: 'Purple', img: imgPurple, paid: true},
  {key: 'material', name: 'Material', img: imgMaterial, paid: true},
  {key: 'solarized', name: 'Solarized', img: imgSolarized, paid: true},
  {key: 'solarized-light', name: 'Solarized Light', img: imgSolarizedLight, paid: true},
  {key: 'solarized-dark', name: 'Solarized Dark', img: imgSolarizedDark, paid: true},
  {key: 'railscasts', name: 'Railscasts', img: imgRailscasts, paid: true},
];

class SettingsTheme extends Component {
  state = {
    isPremium: localStorage.getItem('settings.theme.isPremium') || false,
  };

  async componentDidMount () {
    // NOTE: This is kind of sketchy because we're relying on our parent (tab view)
    // to remove->add us every time our tab is shown. If it didn't, we would need to
    // also hook into componentWillUpdate somehow to refresh more often.

    if (!session.isLoggedIn()) {
      this.setState({isPremium: false});
      return;
    }

    const {isPremium} = await session.whoami();
    if (this.state.isPremium !== isPremium) {
      this.setState({isPremium});
      localStorage.setItem('settings.theme.isPremium', isPremium);
    }
  }

  renderTheme = theme => {
    const {handleChangeTheme, activeTheme} = this.props;
    const {isPremium} = this.state;
    const isActive = activeTheme === theme.key;
    const disabled = theme.paid && !isPremium;

    return (
      <div key={theme.key} className="themes__theme" style={{maxWidth: `${100 / THEMES_PER_ROW}%`}}>
        <h2 className="txt-lg">
          {theme.name}
          {" "}
          {isActive ? <span className="no-margin-top faint italic txt-md">(Active)</span> : null}
        </h2>
        {disabled ? (
            <Link button={true} href="https://insomnia.rest/pricing/" className="themes__theme--locked">
              <img src={theme.img} alt={theme.name} style={{maxWidth: '100%'}}/>
            </Link>
          ) : (
            <Button onClick={handleChangeTheme} value={theme.key}>
              <img src={theme.img} alt={theme.name} style={{maxWidth: '100%'}}/>
            </Button>
          )}
      </div>
    )
  };

  renderThemeRows (themes) {
    const rows = [];
    let row = [];

    for (const theme of themes) {
      row.push(theme);
      if (row.length === THEMES_PER_ROW) {
        rows.push(row);
        row = [];
      }
    }

    // Push the last row if it wasn't finished
    if (row.length) {
      rows.push(row);
    }

    return rows.map((row, i) => (
      <div key={i} className="themes__row">
        {row.map(this.renderTheme)}
      </div>
    ));
  };

  render () {
    return (
      <div className="pad themes">
        {this.renderThemeRows(THEMES)}
      </div>
    )
  }
}

SettingsTheme.propTypes = {
  handleChangeTheme: PropTypes.func.isRequired,
  activeTheme: PropTypes.string.isRequired,
};

export default SettingsTheme;