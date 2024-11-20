use std::collections::BTreeMap;
use std::fmt;

#[derive(Debug, Clone, Eq, PartialEq)]
pub enum KvToken {
    OpenObject,
    CloseObject,
    String(String),
}

#[derive(Debug, Clone, Eq, PartialEq)]
pub enum KvValue {
    String(String),
    Object(BTreeMap<String, KvValue>),
}

#[derive(Debug, Clone, Eq, PartialEq)]
pub struct KeyValue {
    pub key: String,
    pub value: KvValue,
}
