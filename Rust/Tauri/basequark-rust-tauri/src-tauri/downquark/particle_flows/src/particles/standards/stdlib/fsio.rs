use std::{
    fs::{self, File},
    io::{BufRead, BufReader, Read, Write},
};
use toml::Table;

// READ METHODS
pub fn read_file(f: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("READ FILE: {}", f);
    let _str = read_file_string(f)?;
    println!("read_file_string: {}", _str);
    println!("str");
    let _vec = read_file_vec(f)?;
    println!("read_file_vec: {:?}", _vec);
    println!("vec");
    let _ln = read_file_line_by_line(f)?;
    println!("read_file_ln: {:?}", _ln);
    println!("ln");
    let _buf = read_file_buffer(f)?;
    println!("read_file_buf: {:?}", _buf);
    println!("buf");
    println!("xREAD FILE");
    Ok(())
}

pub fn read_file_string(filepath: &str) -> Result<String, Box<dyn std::error::Error>> {
    // println!("read_file_string: {}", filepath);
    let data = fs::read_to_string(filepath.to_string())?;
    Ok(data)
}

fn read_file_vec(filepath: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    println!("vec");
    let data = fs::read(filepath)?;
    Ok(data)
}

fn read_file_line_by_line(filepath: &str) -> Result<(), Box<dyn std::error::Error>> {
    let file = File::open(filepath)?;
    let reader = BufReader::new(file);

    for line in reader.lines() {
        println!("> {}", line?);
    }

    Ok(())
}

fn read_file_buffer(filepath: &str) -> Result<(), Box<dyn std::error::Error>> {
    const BUFFER_LEN: usize = 512;
    let mut buffer = [0u8; 512];

    let mut file = File::open(filepath)?;

    loop {
        let read_count = file.read(&mut buffer)?;

        do_something(&buffer[..read_count]);

        if read_count != BUFFER_LEN {
            break;
        }
    }
    Ok(())
}

fn do_something(_data: &[u8]) {
    println!("do: {:?}", _data)
}

// WRITE METHODS
pub fn create_dir_and_write_file(
    dir_path: String,
    file_path: String,
    file_content: String,
) -> std::io::Result<()> {
    fs::create_dir_all(dir_path)?;
    let mut f = File::create(file_path)?;
    f.write_all(file_content.as_bytes())?;
    Ok(())
}
pub fn overwrite_file(file_path: &str, updated_file_content: &str) -> std::io::Result<()> {
    let mut f = File::options().write(true).open(file_path)?;
    f.write_all(updated_file_content.as_bytes())?;
    Ok(())
}

// CONVERSION METHODS
pub fn parse_content_as_toml(content: String) -> Table {
    content.parse::<Table>().unwrap()
}
pub fn parse_file_as_toml(path_str: &str) -> Table {
    let file_contents_bind = read_file_string(path_str);
    let file_contents = file_contents_bind.expect("invalid config");
    parse_content_as_toml(file_contents)
}
