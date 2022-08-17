$file = Get-ChildItem -Path ./dist -Exclude "*.zip"

$compress = @{
    Path             = $file
    CompressionLevel = "Fastest"
    DestinationPath  = "./dist/dist.zip"
}
Compress-Archive @compress