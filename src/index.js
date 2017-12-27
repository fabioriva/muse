import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import {
  HashRouter as Router,
  Route,
  // Link,
  Switch
} from 'react-router-dom'
import { LocaleProvider, Layout } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'

// import About from './App.js'
import Footer from './components/Footer'
import Navbar from './containers/NavbarContainer'
import Sidebar from './containers/SidebarContainer'
import Alarms from './containers/AlarmsContainer.js'
import Cards from './containers/CardsContainer'
import Diag from './containers/DiagContainer.js'
import History from './containers/HistoryContainer'
import Map from './containers/MapContainer'
import Overview from './containers/OverviewContainer'
import Rack from './containers/RackContainer'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

const store = configureStore()

render(
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <Router>
        <Layout className='layout ant-layout-has-sider'>
          <Sidebar />
          <Layout>
            <Navbar />
            <Switch>
              {/* <Route path='/' component={About} /> */}
              <Route path='/alarms' component={Alarms} />
              <Route path='/cards' component={Cards} />
              <Route path='/diag' component={Diag} />
              <Route path='/history' component={History} />
              <Route path='/map' component={Map} />
              {/* <Route path='/overview' component={Overview} /> */}
              <Route path='/rack' component={Rack} /> */}
              <Route path='*' component={Overview} />
            </Switch>
            <Footer />
          </Layout>
        </Layout>
      </Router>
    </LocaleProvider>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
