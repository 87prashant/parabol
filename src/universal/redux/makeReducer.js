import {combineReducers} from 'redux';
import toasts from 'universal/modules/toast/ducks/toastDuck';
import {reducer as formReducer, actionTypes} from 'redux-form';
import makeRootReducer from 'universal/redux/rootDuck';
import menuReducer from 'universal/modules/menu/ducks/menuDuck';
import dashReducer from 'universal/modules/dashboard/ducks/dashDuck';

const {SET_SUBMIT_SUCCEEDED} = actionTypes;

// wipe the value clean when submitted
const wipeAfterSuccess = (formToClear) => (state, action) => {
  if (action.type === SET_SUBMIT_SUCCEEDED) {
    if (action.meta.form === formToClear) {
      return undefined;
    }
  }
  return state;
};

const formPluginFactory = () => {
  // add new fields to this array if you want em cleared
  const clearMeAfterSubmit = ['agendaInput', 'inviteTeamMember'];
  return clearMeAfterSubmit.reduce((formPlugin, name) => {
    formPlugin[name] = wipeAfterSuccess(name);
    return formPlugin;
  }, {});
};

const formPlugin = formPluginFactory();

const appReducers = {
  form: formReducer.plugin(formPlugin),
  dash: dashReducer,
  menu: menuReducer,
  toasts
};


export default (newReducers) => {
  Object.assign(appReducers, newReducers);
  const appReducer = combineReducers({...appReducers});
  return makeRootReducer(appReducer);
};
