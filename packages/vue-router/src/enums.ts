/**
 * 路径段类型
 */
export enum PathSegmentType {
  /**
   * 普通路径
   */
  Normal,

  /**
   * 索引路由 (index)
   */
  Index,

  /**
   * 动态路径参数 ([param] 或 :param)
   */
  Dynamic,

  /**
   * 捕获所有 ([...param])
   */
  CatchAll
}

/**
 * 路由导入模式
 */
export enum ImportMode {
  /**
   * 同步导入
   */
  Sync = 'sync',

  /**
   * 异步导入 (懒加载)
   */
  Async = 'async'
}
