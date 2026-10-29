require "json"

# Jekyll serve removes generated search assets on rebuild; recreate them afterward.
Jekyll::Hooks.register(:site, :post_write) do |site|
  next unless site.config["serving"]

  cached = Dir[File.join(Dir.home, ".npm/_npx/*/node_modules/pagefind/package.json")].find do |path|
    JSON.parse(File.read(path))["version"] == "1.5.2"
  end
  command = cached ? ["node", File.join(File.dirname(cached), "lib/runner/bin.cjs")] : ["npx", "--yes", "pagefind@1.5.2"]
  unless system(*command, "--site", site.dest)
    Jekyll.logger.error "Pagefind:", "não foi possível gerar a busca da prévia."
  end
end
