
brew install chruby ruby-install xz

gem update --system


jekyll new --skip-bundle . --force

bundle install
bundle add webrick

bundle exec jekyll serve


gem install http_parser.rb -v '0.8.0' --source 'https://rubygems.org/'