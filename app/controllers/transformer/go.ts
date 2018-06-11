function makeSureFirstUpperCase(str) {
  const arr = str.split('');
  const s = arr[0];
  arr[0] = s.toUpperCase();
  return arr.join('');
}

export default function(dataList: any[], tableName) {
  const raw = `/* generate by i18n error platform, please do not edit it */
package i18nErr
import "fmt"

var (${dataList
    .sort(v => -v.key)
    .map(d => {
      const key = makeSureFirstUpperCase(d.key);
      const c = d.code;
      const detail = d.value_en;
      return `
    ${key} = &Error{Code: ${c}, Detail: "${detail}", Prefix: "${d.tableName || tableName}"}   // ${
        d.value_cn
      }`;
    })
    .join('')}
)

type Error struct {
	Code   int32
	Detail string
	Prefix string
	vars   []interface{}
}

func (e *Error) GetCode() int32 {
	return e.Code
}

func (e *Error) GetDetail() string {
	return e.Detail
}

func (e *Error) SetDetail(c string) *Error {
	e.Detail = c
	return e
}

func (e *Error) GetPrefix() string {
	return e.Prefix
}

func (e *Error) GetVars() []interface{} {
	return e.vars
}

func (e *Error) SetVars(con ...interface{}) *Error {
	e2 := &Error{}
	*e2 = *e
	e2.vars = con
	return e2
}

func (e *Error) Error() string {
	return fmt.Sprintf("%s%d|%s", e.Prefix, e.Code, e.Detail)
}`;

  return raw;
}
