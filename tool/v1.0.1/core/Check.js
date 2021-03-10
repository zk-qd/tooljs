window.$check = {
    // 判断是否为本地方法
    isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
    },
    /**
   * Check for plain object.
   *
   * @param {Mixed} val
   * @return {Boolean}
   * @api private
   */
    isObject(val) {
        return Object == val.constructor;
    },
    /**
     * Check if `obj` is a promise.
     *
     * @param {Object} obj
     * @return {Boolean}
     * @api private
     */

    isPromise(obj) {
        return 'function' == typeof obj.then;
    },
    /**
     * Check if `obj` is a generator.
     * 判断generator的调用
     * @param {Mixed} obj
     * @return {Boolean}
     * @api private
     */
    isGenerator(obj) {
        return 'function' == typeof obj.next && 'function' == typeof obj.throw;
    },
    /**
     * Check if `obj` is a generator function.
     * 判断是否是 generator构造函数
     * @param {Mixed} obj
     * @return {Boolean}
     * @api private
     */
    isGeneratorFunction(obj) {
        var constructor = obj.constructor;
        if (!constructor) return false;
        // gen的构造函数名字确实是 GeneratorFunction  
        if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
        // 继承generator的也可以
        return isGenerator(constructor.prototype);
    },
}