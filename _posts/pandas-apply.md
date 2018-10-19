---
title: Pandas 中的 apply 函数使用示例
date: 2016-11-03 11:25:42
tags:
  - Python
  - Data Science
---

`apply` 是 `pandas` 库的一个很重要的函数，多和 `groupby` 函数一起用，也可以直接用于 `DataFrame` 和 `Series` 对象。主要用于数据聚合运算，可以很方便的对分组进行现有的运算和自定义的运算。

<!-- more -->

<img src=http://img.blog.csdn.net/20161103121959466>

---

## 数据集
使用的数据集是美国人口普查的数据，可以从[这里](http://download.csdn.net/download/u010099080/9671742)下载，里面包含了CSV数据文件和PDF说明文件，说明文件里解释了每个变量的意义。

数据大致是这个样子：

<div><img src=http://i.imgur.com/FMLFgq8.png width=100% alt="美国人口普查数据"></div>
<center><font color="gray">*美国人口普查数据*</font></center>

---

## 问题

1. 以每个州人口最多的 3 个县的人口总和为这个州人口的衡量标准，哪 3 个州人口最多？
2. 在 2010 年至 2015 年间人口变化幅度最大的是哪个县？

---

## 分析

1. 先按州分组，再对每个州内的县进行排序选出人口最多的 3 个县求和，作为每个州的人口数，最后排序。
2. 对于每个县，计算 2010-2015 年的人口数的最大值和最小值，求出差值即变化幅度，再对差值进行排序找出变化幅度最大的县。

---

## 代码
### 问题1

```python
census_df = pd.read_csv('census.csv')
only_county = census_df[census_df['SUMLEV'] == 50]


def top(df, n=3, column='CENSUS2010POP'):
    return df.sort_values(column, ascending=False)[:n]['CENSUS2010POP'].sum()


grouped = only_county[['STNAME', 'CTYNAME', 'CENSUS2010POP']].groupby('STNAME').apply(top)
grouped.sort_values(ascending=False)[:3].index.tolist()
```

输出：

![](http://i.imgur.com/qcVlBOM.png)

### 问题2

```python
census_df = pd.read_csv('census.csv')
only_county = census_df[census_df['SUMLEV'] == 50]


def get_change(row):
    pop_year = row[['POPESTIMATE2010', 
					'POPESTIMATE2011', 
					'POPESTIMATE2012', 
					'POPESTIMATE2013', 
					'POPESTIMATE2014', 
					'POPESTIMATE2015']]
    return pop_year.max() - pop_year.min()


only_county.loc[only_county.apply(get_change, axis=1).argmax()]['CTYNAME']
```

输出：

![这里写图片描述](http://img.blog.csdn.net/20161103111937965)

---

## END
