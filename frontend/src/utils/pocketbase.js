import PocketBase from 'pocketbase';
import urls from './urls';

const pb = new PocketBase(urls.pocketbase_url);

export default pb;
