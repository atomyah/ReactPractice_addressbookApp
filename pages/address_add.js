import Link from 'next/link';
import Layout from '../components/Layout';

import AddressAdd from '../components/AddressAdd';
import firebase from "firebase";


export default () =>(
  <Layout header="Address" title="address create.">
    <AddressAdd />
    <hr />
    <div>
      <Link href="/address">
        <button>back</button>
      </Link>
    </div>
  </Layout>
);
