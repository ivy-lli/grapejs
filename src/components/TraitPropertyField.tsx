import * as React from 'react';
import { useEditor } from '@grapesjs/react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type { Trait } from 'grapesjs';
import { ROUND_BORDER_COLOR, cx } from './common';
import { IconButton, OutlinedInput } from '@mui/material';
import Icon from '@mdi/react';
import { mdiSearchWeb } from '@mdi/js';

const ExternalData = ({value, onChange, handleChange}: {value: string, onChange: (ev: unknown) => void, handleChange: (value: string) => void}) => {
  const [data, setData] = React.useState(value);
  React.useEffect(() => setData(value), [value]);
  return (
    <>
      <OutlinedInput sx={{ ml: 1, flex: 1 }} size="small" value={data} onChange={onChange} fullWidth style={{margin: '0'}} endAdornment={
        <InputAdornment position="end">
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={async () => {
            const person = await fetch('https://swapi.dev/api/people/1/').then(res => res.json())
            setData(person.name);
            handleChange(person.name);
          }}>
            <Icon path={mdiSearchWeb} size={1} />
          </IconButton>
        </InputAdornment>
      } />
    </>
  );
}

interface StylePropertyFieldProps extends React.HTMLProps<HTMLDivElement> {
  trait: Trait;
}

export default function TraitPropertyField({
  trait,
  ...rest
}: StylePropertyFieldProps) {
  const editor = useEditor();
  const handleChange = (value: string) => {
    trait.setValue(value);
  };

  const onChange = (ev: any) => {
    handleChange(ev.target.value);
  };

  const handleButtonClick = () => {
    const command = trait.get('command');
    if (command) {
      typeof command === 'string'
        ? editor.runCommand(command)
        : command(editor, trait);
    }
  };

  const type = trait.getType();
  const defValue = trait.getDefault() || trait.attributes.placeholder;
  const value = trait.getValue();
  const valueWithDef = typeof value !== 'undefined' ? value : defValue;

  let inputToRender = (
    <TextField
      placeholder={defValue}
      value={value}
      onChange={onChange}
      size="small"
      fullWidth
    />
  );

  switch (type) {
    case 'select':
      {
        inputToRender = (
          <FormControl fullWidth size="small">
            <Select value={value} onChange={onChange}>
              {trait.getOptions().map((option) => (
                <MenuItem
                  key={trait.getOptionId(option)}
                  value={trait.getOptionId(option)}
                >
                  {trait.getOptionLabel(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
      break;
    case 'color':
      {
        inputToRender = (
          <TextField
            fullWidth
            placeholder={defValue}
            value={value}
            onChange={onChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <div
                    className={`w-[15px] h-[15px] ${ROUND_BORDER_COLOR}`}
                    style={{ backgroundColor: valueWithDef }}
                  >
                    <input
                      type="color"
                      className="w-[15px] h-[15px] cursor-pointer opacity-0"
                      value={valueWithDef}
                      onChange={(ev) => handleChange(ev.target.value)}
                    />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        );
      }
      break;
    case 'checkbox':
      {
        inputToRender = (
          <Checkbox
            checked={value}
            onChange={(ev) => trait.setValue(ev.target.checked)}
            size="small"
          />
        );
      }
      break;
    case 'button':
      {
        inputToRender = (
          <Button fullWidth onClick={handleButtonClick}>
            {trait.getLabel()}
          </Button>
        );
      }
      break;
    case 'data': {
      inputToRender = <ExternalData value={value} onChange={onChange} handleChange={handleChange} />;
    }
  }

  return (
    <div {...rest} className={cx('mb-3 px-1 w-full')}>
      <div className={cx('flex mb-2 items-center')}>
        <div className="flex-grow capitalize">{trait.getLabel()}</div>
      </div>
      {inputToRender}
    </div>
  );
}
