require 'pg'

conn = PG.connect( dbname: 'w4d2' )
conn.exec( "SELECT * FROM users" ) do |result|
  result.each do |row|
    puts " %d | %-16s | %s " %
      row.values_at('id', 'email', 'password')
  end
end