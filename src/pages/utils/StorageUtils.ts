import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

@Injectable()
export class StorageUtils {


  constructor(private storage: Storage) {

  }

  /*根据key获取value值*/
  getStorage(key, callback) {
    this.storage.get(key).then((data) => {
      callback(data);
    })
  }

  /*存储key的value值*/
  setStorage(key, value) {
    this.storage.set(key, value);
  }

  /**
   * 删除key的value值
   * @param key
   */
  delStorage(key) {
    this.storage.remove(key);
  }

  /**
   * 清除所有的value值
   */
  delAllStorage() {
    this.storage.clear();
  }

}
