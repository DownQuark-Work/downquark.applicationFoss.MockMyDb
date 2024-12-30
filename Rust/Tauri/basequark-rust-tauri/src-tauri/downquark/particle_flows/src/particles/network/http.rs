pub async fn await_get_request(request_url: &str) -> Result<String, Box<dyn std::error::Error>> {
    let body = reqwest::get(request_url).await?.text().await?;
    // println!("body: {:?}",body);
    Ok(body)
}

pub fn block_get_request(request_url: &str) -> Result<String, Box<dyn std::error::Error>> {
    let body = reqwest::blocking::get(request_url)?.text()?;
    // println!("body: {:?}",body);
    Ok(body)
}
